import React from 'react'
import styled, { withTheme } from 'styled-components'
import sun from '../images/sun_animated.svg'
import { useSpring, useTransition, animated, config } from 'react-spring'
import {
  mainDark,
  mainLight,
  accentDark,
  accentLight,
  brandColor,
  RGBMainLight,
} from '../theme/colors'

const darken = color =>
  color
    .split(',')
    .map(num => Number(num / 2).toFixed(0))
    .join(',')

const LoadingAnimationModal = ({
  theme: {
    name,
    darkMode,
    colors: {
      RGBAccentDark,
      RGBAccentLight,
      RGBBrandColor,
      RGBMainDark,
      RGBMainLight,
    },
  },
}) => {
  const accentDark = `rgb(${darkMode ? darken(RGBAccentLight) : RGBAccentDark})`
  const accentLight = ` rgb(${darkMode ? RGBAccentDark : RGBAccentLight})`
  const brandColor = `rgb(${darkMode ? darken(RGBBrandColor) : RGBBrandColor})`
  const mainDark = `rgb(${darkMode ? darken(RGBMainLight) : RGBMainDark})`
  const mainLight = `rgb(${darkMode ? RGBMainDark : RGBMainLight})`

  const loadingAnimation = useSpring({
    position: `relative`,
    transform: `scale(1)`,
    opacity: 1,
    top: 0,
    from: { transform: `scale(0.5)`, top: -100, opacity: 0 },
    config: config.slow,
  })
  const modalBackground = useSpring({
    background: `linear- gradient( to top left, ${brandColor}, ${mainLight}, ${accentLight})`,
    from: {
      background: `linear-gradient(to top left, ${accentDark},${brandColor}, ${mainDark})`,
    },
    config: config.slow,
  })
  return (
    <Modal style={modalBackground}>
      <Loading style={loadingAnimation}>
        <object type={'image/svg+xml'} data={sun}>
          Your browser does not support SVG
        </object>
        <p>Dashboard is loading</p>
      </Loading>
    </Modal>
  )
}

const Modal = styled(animated.div)`
  position: fixed;
  top: 0;
  color: var(--brand-color);
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  text-align: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--brand-color);
  background: -webkit-linear-gradient(
    to top left,
    var(--accent-dark),
    var(--brand-color),
    var(--main-dark)
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to top left,
    var(--accent-dark),
    var(--brand-color),
    var(--main-dark)
  );
  z-index: 10000;
`

const Loading = styled(animated.div)`
  width: 500px;
  margin: auto;
  font-size: 1.3em;
`

export default withTheme(LoadingAnimationModal)
