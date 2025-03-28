import React from 'react';
import Svg, { Rect, Defs, Mask } from 'react-native-svg';

const CameraOverlay = () => (
  <Svg width="100%" height="100%" viewBox="0 0 550 550">
    <Defs>
      <Mask id="mask">
        {/* Fundo branco (visível) */}
        <Rect x="0" y="0" width="550" height="550" fill="white" />
        {/* Área do buraco da câmera (preta = transparente no Mask) */}
        <Rect x="100" y="150" width="350" height="250" rx="20" fill="black" />
      </Mask>
    </Defs>

    {/* Camada semi-transparente com máscara */}
    <Rect
      x="0"
      y="0"
      width="550"
      height="550"
      fill="rgba(0,0,0,0.6)"
      mask="url(#mask)"
    />
  </Svg>
);

export default CameraOverlay;
