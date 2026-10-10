import { motion } from 'motion/react'
import { Link } from 'react-router'

/** A router Link that takes Motion props, for animated in-site links. */
const MotionLink = motion.create(Link)

export default MotionLink
