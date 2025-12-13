import React, { useEffect, useState } from "react";

const TYPE_CONFIG = {
  TEMPERATURE: { unit: "°C", prefix: "TP" },
  HUMIDITY: { unit: "%", prefix: "HM" },
  SOIL_MOISTURE: { unit: "%", prefix: "SL" },
  LIGHT: { unit: "lx", prefix: "LG" },
};

const EMPTY_FORM = {
  id: "",
  prefix: "TP",
  name: "",
  type: "TEMPERATURE",
  location: "",
  pinNumber: "",
  greenhouseId: "",
  unit: "°C",
  active: true,
};

const SensorForm = ({ initial, onSubmit }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = !!initial;

  useEffect(() => {
    if (initial) {
      const cfg = TYPE_CONFIG[initial.type];

      setForm({
        id: initial.id ?? "",
        prefix: cfg.prefix,
        name: initial.name ?? "",
        type: initial.type,
        location: initial.location ?? "",
        pinNumber: initial.pinNumber ?? "",
        greenhouseId: initial.greenhouseId ?? "",
        unit: initial.unit ?? cfg.unit,
        active: initial.active ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "type") {
        const cfg = TYPE_CONFIG[value];
        next.prefix = cfg.prefix;
        next.unit = cfg.unit;
      }

      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      fullName: `${form.prefix}-${form.name}`, // if backend expects combined name
    };

    onSubmit(payload, isEdit);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Prefix + Name */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Prefix</label>
          <input
            className="w-full bg-slate-100 border border-slate-200 rounded-md px-2 py-1.5 text-sm"
            value={form.prefix}
            readOnly
          />
        </div>

        <div className="col-span-2 space-y-1">
          <label className="text-xs text-slate-500">Name</label>
          <input
            className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm"
            value={form.name}
            onChange={handleChange("name")}
            placeholder="Greenhouse Temp Sensor"
            required
          />
        </div>
      </div>

      {/* Type + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Type</label>
          <select
            className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm"
            value={form.type}
            onChange={handleChange("type")}
          >
            <option value="TEMPERATURE">Temperature</option>
            <option value="HUMIDITY">Humidity</option>
            <option value="SOIL_MOISTURE">Soil Moisture</option>
            <option value="LIGHT">Light</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500">Unit</label>
          <input
            className="w-full bg-slate-100 border border-slate-200 rounded-md px-2 py-1.5 text-sm"
            value={form.unit}
            readOnly
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-1">
        <label className="text-xs text-slate-500">Location</label>
        <input
          className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm"
          value={form.location}
          onChange={handleChange("location")}
          placeholder="North rack, Roof, Bed #2..."
        />
      </div>

      {/* Pin */}
      <div className="space-y-1">
        <label className="text-xs text-slate-500">Pin Number</label>
        <input
          className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm"
          value={form.pinNumber}
          onChange={handleChange("pinNumber")}
          placeholder="D5, A0, GPIO14..."
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="bg-slate-900 text-white px-4 py-1.5 rounded-md text-sm"
        >
          {isEdit ? "Save Changes" : "Create Sensor"}
        </button>
      </div>
    </form>
  );
};

export default SensorForm;
