import BiometriaCanComponent from "@/components/biometria/camera";
import FaceOutline from "@/components/biometria/FaceOutiline";
import Rotation from "@/components/biometria/Rotation";
import React, { useState } from "react";



export default function Biometria() {
  const [OrientationStatus, setOrientationStatus] = useState(0);
  return (
    <Rotation Orientation={(value: any) => setOrientationStatus(value)}>
     <BiometriaCanComponent OrientationStatus={OrientationStatus}/>
     <FaceOutline />
    </Rotation>
  );
}
