import React, { useEffect, useState } from "react";
import ApiConfig from "../api/apiConfig";
import toast from "react-hot-toast";
import SensorTable from "../components/Admin/SensorTable";
import SensorForm from "../components/Admin/SensorForm";
import Modal from "../components/Admin/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

const SensorAdmin = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null); // for edit
  const [filterType, setFilterType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);      // create/edit popup

  // delete dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadSensors = async () => {
    try {
      setLoading(true);
      const data = await ApiConfig.getRequest("/api/admin/sensors");
      setSensors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load sensors", err);
      setSensors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensors();
  }, []);

  const handleCreateOrUpdate = async (payload, isEdit) => {
    try {
      if (isEdit) {
        await ApiConfig.putRequest(`/api/admin/sensors/${payload.id}`, payload);
        toast.success("Sensor updated");
      } else {
        await ApiConfig.postRequest("/api/admin/sensors", payload);
        toast.success("Sensor created");
      }
      setSelectedSensor(null);
      setIsModalOpen(false);
      loadSensors();
    } catch (err) {
      console.error("Save sensor failed", err);
      toast.error("Failed to save sensor");
    }
  };

  // Instead of window.confirm, just open the dialog
  const requestDelete = (sensor) => {
    setDeleteTarget(sensor);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await ApiConfig.deleteRequest(`/api/admin/sensors/${deleteTarget.id}`);
      toast.success("Sensor deleted");
      setIsDeleteOpen(false);
      setDeleteTarget(null);
      loadSensors();
    } catch (err) {
      console.error("Delete sensor failed", err);
      toast.error("Failed to delete sensor");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteOpen(false);
    setDeleteTarget(null);
  };

  const handleToggleActive = async (sensor) => {
    try {
      await ApiConfig.putRequest(`/api/admin/sensors/${sensor.id}/active`, {
        active: !sensor.active,
      });
      toast.success(`Sensor ${!sensor.active ? "activated" : "deactivated"}`);
      loadSensors();
    } catch (err) {
      console.error("Toggle active failed", err);
      toast.error("Failed to update sensor status");
    }
  };

  const filteredSensors = sensors.filter((s) => {
    const matchesType = filterType === "ALL" ? true : s.type === filterType;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.location || "").toLowerCase().includes(q) ||
      (s.pinNumber || "").toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Sensor Administration</h1>
            <p className="text-sm text-slate-600">
              Manage greenhouse sensors (configure, activate, remove)
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedSensor(null);  // create mode
              setIsModalOpen(true);     // open popup
            }}
            className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm"
          >
            + New Sensor
          </button>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm px-3 py-2 flex items-center gap-2">
            <span className="text-xs text-slate-500">Type</span>
            <select
              className="text-sm border border-slate-200 rounded-md px-2 py-1"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="TEMPERATURE">Temperature</option>
              <option value="HUMIDITY">Humidity</option>
              <option value="SOIL_MOISTURE">Soil Moisture</option>
              <option value="LIGHT">Light</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm px-3 py-2 flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-xs text-slate-500">Search</span>
            <input
              className="flex-1 text-sm border border-slate-200 rounded-md px-2 py-1"
              placeholder="Name, location, pin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table only */}
        <section className="bg-white p-4 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Sensors</h2>
            {loading && (
              <span className="text-xs text-slate-400 animate-pulse">
                Loading...
              </span>
            )}
          </div>
          <SensorTable
            sensors={filteredSensors}
            onEdit={(sensor) => {
              setSelectedSensor(sensor); // edit mode
              setIsModalOpen(true);      // open popup
            }}
            onDelete={requestDelete}      // ⬅️ open confirm dialog
            onToggleActive={handleToggleActive}
          />
        </section>
      </div>

      {/* Create / Edit Sensor Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSensor(null);
        }}
        title={selectedSensor ? "Edit Sensor" : "Create Sensor"}
      >
        <SensorForm
          key={selectedSensor?.id || "new"}
          initial={selectedSensor}
          onSubmit={handleCreateOrUpdate}
        />
      </Modal>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete sensor?"
        message={
          deleteTarget
            ? `Are you sure you want to delete sensor "${deleteTarget.name}"? This cannot be undone.`
            : "Are you sure you want to delete this sensor?"
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default SensorAdmin;
