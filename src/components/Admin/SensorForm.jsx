import React, { useEffect, useState } from "react";

const EMPTY_FORM = {
  id: "",
  name: "",
  type: "TEMPERATURE",
  location: "",
  pinNumber: "",
  greenhouseId: "",
  unit: "",
  active: true,
};

const SensorForm = ({ initial, onSubmit }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initial) {
      setForm({
        id: initial.id || "",
        name: initial.name || "",
        type: initial.type || "TEMPERATURE",
        location: initial.location || "",
        pinNumber: initial.pinNumber || initial.pin_number || "",
        greenhouseId: initial.greenhouseId || "",
        unit: initial.unit || "",
        active: !!initial.active,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial]);

  const handleChange = (field) => (e) => {
    const value =
      field === "active" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      // adapt to backend property names
      pinNumber: form.pinNumber,
    };
    const isEdit = !!initial;
    onSubmit(payload, isEdit);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <label className="text-xs text-slate-500">Name</label>
        <input
          className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm"
          value={form.name}
          onChange={handleChange("name")}
          required
        />
      </div>

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
            className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm"
            value={form.unit}
            onChange={handleChange("unit")}
            placeholder="°C, %, lx, ..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Location</label>
          <input
            className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm"
            value={form.location}
            onChange={handleChange("location")}
            placeholder="North bed, Roof, ..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500">Pin / Channel</label>
          <input
            className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm"
            value={form.pinNumber}
            onChange={handleChange("pinNumber")}
            placeholder="A0, D5, GPIO12..."
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-500">Greenhouse ID (optional)</label>
        <input
          className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-sm"
          value={form.greenhouseId}
          onChange={handleChange("greenhouseId")}
          placeholder="GH-001"
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={form.active}
            onChange={handleChange("active")}
          />
          Active
        </label>

        <button
          type="submit"
          className="bg-slate-900 text-white px-4 py-1.5 rounded-md text-sm"
        >
          {initial ? "Save Changes" : "Create Sensor"}
        </button>
      </div>
    </form>
  );
};

export default SensorForm;
