import React from "react";
import { Droplets, SmartphoneNfc, Sprout, SunMedium, Thermometer } from "lucide-react";

const SensorTypeBadge = ({ type }) => {
  const base =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium";

  switch (type) {
    case "TEMPERATURE":
      return (
        <span className={`${base} bg-red-100 text-red-700`}>
          <Thermometer size={12} />
          Temperature
        </span>
      );

    case "HUMIDITY":
      return (
        <span className={`${base} bg-sky-100 text-sky-700`}>
          <Droplets size={12} />
          Humidity
        </span>
      );

    case "SOIL_MOISTURE":
      return (
        <span className={`${base} bg-emerald-100 text-emerald-700`}>
          <Sprout size={12} />
          Soil
        </span>
      );

    case "LIGHT":
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>
          <SunMedium size={12} />
          Light
        </span>
      );

    default:
      return (
        <span className={`${base} bg-slate-100 text-slate-600`}>
            <SmartphoneNfc size={12}/>
          {type}
        </span>
      );
  }
};
export default SensorTypeBadge;