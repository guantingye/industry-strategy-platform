import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const TEXTURES = {
  day: '/textures/earth_day.jpg',
  normal: '/textures/earth_normal.jpg',
  lights: '/textures/earth_lights.png',
  clouds: '/textures/earth_clouds.png',
  specular: '/textures/earth_specular.jpg',
}

const FRONT = new THREE.Vector3(0, 0, 1)
const AXIS_X = new THREE.Vector3(1, 0, 0)
const AXIS_Y = new THREE.Vector3(0, 1, 0)

function latLngToUnitVec3(lat, lng) {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lng + 180)

  const x = -(Math.sin(phi) * Math.cos(theta))
  const z = Math.sin(phi) * Math.sin(theta)
  const y = Math.cos(phi)

  return new THREE.Vector3(x, y, z).normalize()
}

function makeRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.45
  renderer.setClearColor(0x000000, 0) // allow the page background to blend
  return renderer
}

function createEarthMeshes(loader) {
  const texDay = loader.load(TEXTURES.day)
  const texNormal = loader.load(TEXTURES.normal)
  const texLights = loader.load(TEXTURES.lights)
  const texSpec = loader.load(TEXTURES.specular)

  texDay.colorSpace = THREE.SRGBColorSpace
  texLights.colorSpace = THREE.SRGBColorSpace
  texSpec.colorSpace = THREE.SRGBColorSpace

  const geometry = new THREE.SphereGeometry(1, 80, 80)
  const material = new THREE.MeshPhongMaterial({
    map: texDay,
    normalMap: texNormal,
    specularMap: texSpec,
    specular: new THREE.Color(0x222222),
    shininess: 12,
    emissiveMap: texLights,
    emissive: new THREE.Color(0x0b1b2a),
    emissiveIntensity: 0.45,
  })

  const earth = new THREE.Mesh(geometry, material)

  const texClouds = loader.load(TEXTURES.clouds)
  texClouds.colorSpace = THREE.SRGBColorSpace
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(1.01, 80, 80),
    new THREE.MeshPhongMaterial({
      map: texClouds,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    })
  )

  return { earth, clouds }
}

function createStarfield({ count = 2600, radius = 38 }) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    // Random distribution in a spherical shell.
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    const r = radius * (0.55 + 0.45 * Math.random())
    const sinPhi = Math.sin(phi)
    const x = r * sinPhi * Math.cos(theta)
    const y = r * Math.cos(phi)
    const z = r * sinPhi * Math.sin(theta)
    positions[i * 3 + 0] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.035,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  })

  const points = new THREE.Points(geometry, material)
  return {
    object: points,
    dispose: () => {
      geometry.dispose()
      material.dispose()
    },
  }
}

function createHubMarkers(hubs = []) {
  const group = new THREE.Group()

  // Visual style: clean, business-grade “location beacon” without looking game-y.
  const sphereGeo = new THREE.SphereGeometry(0.018, 18, 18)
  const ringGeo = new THREE.RingGeometry(0.024, 0.040, 48)

  const baseSphereMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc })
  const baseRingMat = new THREE.MeshBasicMaterial({
    color: 0x9ee7ff,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  })

  const activeSphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const activeRingMat = new THREE.MeshBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  })

  /** @type {Map<string, THREE.Group>} */
  const markers = new Map()

  hubs.forEach((hub) => {
    if (!hub || typeof hub.lat !== 'number' || typeof hub.lng !== 'number') return

    const unit = latLngToUnitVec3(hub.lat, hub.lng)
    const position = unit.clone().multiplyScalar(1.03)

    // Group is oriented so its local +Z points outward from Earth.
    const g = new THREE.Group()
    g.position.copy(position)
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), unit)
    g.userData = { hubId: hub.id }

    const sphere = new THREE.Mesh(sphereGeo, baseSphereMat)
    sphere.userData = { hubId: hub.id }
    sphere.renderOrder = 3

    const ring = new THREE.Mesh(ringGeo, baseRingMat)
    ring.position.z = 0.001
    ring.userData = { hubId: hub.id }
    ring.renderOrder = 2

    g.add(ring)
    g.add(sphere)

    group.add(g)
    markers.set(hub.id, g)
  })

  const setActive = (activeId) => {
    markers.forEach((g, id) => {
      const isActive = id === activeId
      const ring = g.children.find((c) => c.geometry === ringGeo)
      const sphere = g.children.find((c) => c.geometry === sphereGeo)
      if (ring && ring.material) ring.material = isActive ? activeRingMat : baseRingMat
      if (sphere && sphere.material) sphere.material = isActive ? activeSphereMat : baseSphereMat
      g.scale.setScalar(isActive ? 1.35 : 1.0)
    })
  }

  return {
    group,
    markers,
    setActive,
    dispose: () => {
      sphereGeo.dispose()
      ringGeo.dispose()
      baseSphereMat.dispose()
      baseRingMat.dispose()
      activeSphereMat.dispose()
      activeRingMat.dispose()
    },
  }
}

/**
 * Three.js Earth viewer
 * - Hub markers are true 3D objects attached to the Earth group, so they rotate with the globe.
 * - Starfield is rendered inside the Three.js scene (no external assets).
 * - Optional `focus` prop rotates Earth toward a given lat/lng.
 */
export default function ThreeGlobe({
  focus,
  hubs = [],
  selectedId,
  onSelect,
  className = '',
}) {
  const mountRef = useRef(null)
  const apiRef = useRef(null)

  const selectedRef = useRef(selectedId)
  const onSelectRef = useRef(onSelect)

  useEffect(() => {
    selectedRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const host = mountRef.current
    if (!host) return

    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    host.appendChild(canvas)

    const renderer = makeRenderer(canvas)
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 3.15)

    // Starfield background (in-scene)
    const starfield = createStarfield({ count: 3000, radius: 42 })
    scene.add(starfield.object)

    // Earth group (everything that rotates together)
    const group = new THREE.Group()
    scene.add(group)

    // Lighting tuned for vivid Earth colors without extra halo meshes.
    scene.add(new THREE.AmbientLight(0xffffff, 0.72))
    const key = new THREE.DirectionalLight(0xffffff, 2.35)
    key.position.set(4, 2.5, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xaad7ff, 0.70)
    rim.position.set(-4, 1, -2)
    scene.add(rim)

    const loader = new THREE.TextureLoader()
    const { earth, clouds } = createEarthMeshes(loader)
    group.add(earth)
    group.add(clouds)

    // Hub markers: real 3D beacons on the sphere.
    const hubApi = createHubMarkers(hubs)
    group.add(hubApi.group)
    hubApi.setActive(selectedRef.current)

    // Interaction + motion state
    let pointerDown = false
    let dragging = false
    let downX = 0
    let downY = 0
    let lastX = 0
    let lastY = 0

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const targetQuat = new THREE.Quaternion()

    // Slower, premium-feel auto-rotation.
    const AUTO_YAW_PER_FRAME = 0.00045
    const CLOUDS_YAW_PER_FRAME = 0.00065

    // Default tilt for cinematic angle.
    const baseTilt = new THREE.Quaternion().setFromAxisAngle(AXIS_X, THREE.MathUtils.degToRad(-10))
    targetQuat.copy(baseTilt)

    function resize() {
      const rect = host.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width))
      const h = Math.max(1, Math.floor(rect.height))
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    function focusTo(next) {
      if (!next || typeof next.lat !== 'number' || typeof next.lng !== 'number') return
      const v = latLngToUnitVec3(next.lat, next.lng)
      const q = new THREE.Quaternion().setFromUnitVectors(v, FRONT)
      targetQuat.copy(baseTilt).multiply(q)
    }

    apiRef.current = { focusTo }

    function pickHub(clientX, clientY) {
      const rect = canvas.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height
      mouse.x = x * 2 - 1
      mouse.y = -(y * 2 - 1)
      raycaster.setFromCamera(mouse, camera)

      const meshes = []
      hubApi.markers.forEach((g) => {
        g.traverse((obj) => {
          if (obj.isMesh) meshes.push(obj)
        })
      })

      const hits = raycaster.intersectObjects(meshes, true)
      if (!hits.length) return null

      let obj = hits[0].object
      while (obj && !obj.userData?.hubId) obj = obj.parent
      return obj?.userData?.hubId || null
    }

    function onPointerDown(e) {
      pointerDown = true
      dragging = false
      downX = lastX = e.clientX
      downY = lastY = e.clientY
    }

    function onPointerMove(e) {
      if (!pointerDown) return
      const dxTotal = e.clientX - downX
      const dyTotal = e.clientY - downY
      const moved = Math.abs(dxTotal) + Math.abs(dyTotal)

      if (!dragging && moved > 4) dragging = true
      if (!dragging) return

      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY

      const qYaw = new THREE.Quaternion().setFromAxisAngle(AXIS_Y, dx * 0.003)
      const qPitch = new THREE.Quaternion().setFromAxisAngle(AXIS_X, dy * 0.003)
      targetQuat.premultiply(qYaw).premultiply(qPitch)
    }

    function onPointerUp(e) {
      if (!pointerDown) return
      pointerDown = false

      // Click selects a hub (only if the user wasn't dragging).
      if (!dragging) {
        const id = pickHub(e.clientX, e.clientY)
        if (id && typeof onSelectRef.current === 'function') {
          onSelectRef.current(id)
        }
      }

      dragging = false
    }

    function onPointerHover(e) {
      if (pointerDown) return
      const id = pickHub(e.clientX, e.clientY)
      host.style.cursor = id ? 'pointer' : 'grab'
    }

    host.addEventListener('pointerdown', onPointerDown)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointermove', onPointerHover)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('resize', resize)
    resize()

    // Initial focus (if provided)
    focusTo(focus)

    let raf = 0
    const clock = new THREE.Clock()
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()

      // Slow, stable spin
      if (!pointerDown || !dragging) {
        const qSpin = new THREE.Quaternion().setFromAxisAngle(AXIS_Y, AUTO_YAW_PER_FRAME)
        targetQuat.premultiply(qSpin)
      }

      group.quaternion.slerp(targetQuat, 0.08)
      clouds.rotation.y += CLOUDS_YAW_PER_FRAME

      // Subtle “breathing” on the active ring only.
      const active = selectedRef.current
      hubApi.setActive(active)
      if (active && hubApi.markers.has(active)) {
        const g = hubApi.markers.get(active)
        const ring = g?.children?.[0]
        if (ring) ring.scale.setScalar(1.0 + 0.08 * Math.sin(t * 2.4))
      }

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      apiRef.current = null
      window.removeEventListener('resize', resize)
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointermove', onPointerHover)
      window.removeEventListener('pointerup', onPointerUp)

      // Dispose
      starfield.dispose()
      hubApi.dispose()
      renderer.dispose()

      ;[earth, clouds].forEach((m) => {
        m.geometry.dispose()
        const mat = m.material
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat.dispose()
      })

      host.removeChild(canvas)
    }
  }, [])

  useEffect(() => {
    apiRef.current?.focusTo(focus)
  }, [focus])

  return <div ref={mountRef} className={className} />
}
