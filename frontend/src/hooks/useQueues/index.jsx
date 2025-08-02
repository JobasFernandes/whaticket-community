import api from "../../services/api.js";

const useQueues = () => {
  const findAll = async () => {
    const { data } = await api.get("/queue");
    return data;
  };

  return { findAll };
};

export default useQueues;
