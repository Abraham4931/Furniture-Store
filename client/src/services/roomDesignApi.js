import api from "./api";

/*
|--------------------------------------------------------------------------
| Room Design API
|--------------------------------------------------------------------------
| Handles room-design and 3D furniture visualization communication.
|
| Backend prefix:
| /api/room-designs
|
| This service can support:
| - Room images
| - Room design data
| - Furniture placement
| - Saved room designs
| - 3D furniture visualization
|--------------------------------------------------------------------------
*/

// Get available room designs
export const getRoomDesigns = () => {
  return api.get("/room-designs");
};

// Get a specific saved room design
export const getRoomDesignById = (id) => {
  return api.get(`/room-designs/${id}`);
};

// Create/save a new room design
export const createRoomDesign = (data) => {
  return api.post("/room-designs", data);
};

// Update an existing room design
export const updateRoomDesign = (id, data) => {
  return api.put(`/room-designs/${id}`, data);
};

// Delete a saved room design
export const deleteRoomDesign = (id) => {
  return api.delete(`/room-designs/${id}`);
};

// Upload a room image
export const uploadRoomImage = (formData) => {
  return api.post("/room-designs/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get furniture placement information for a room design
export const getFurniturePlacements = (designId) => {
  return api.get(`/room-designs/${designId}/furniture`);
};

// Save furniture placement information
export const saveFurniturePlacements = (designId, data) => {
  return api.put(`/room-designs/${designId}/furniture`, data);
};

// Add furniture to a room design
export const addFurnitureToRoom = (designId, data) => {
  return api.post(`/room-designs/${designId}/furniture`, data);
};

// Remove furniture from a room design
export const removeFurnitureFromRoom = (designId, furnitureId) => {
  return api.delete(
    `/room-designs/${designId}/furniture/${furnitureId}`
  );
};

// Get 3D visualization/model information for a room design
export const getRoom3DData = (designId) => {
  return api.get(`/room-designs/${designId}/3d`);
};

// Send room information to the backend 3D processing service
export const processRoomDesign = (data) => {
  return api.post("/room-designs/process", data);
};