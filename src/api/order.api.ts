import api from "./axios";

const orderApi = {
  get: () => {
    return api.get("/carts");
  },
  create: (payload: {}) => {
    return api.post("/orders", payload);
  },
  update: (cartId: number, quantity: number) => {
    return api.put(`/carts/${cartId}`, { quantity });
  },
  delete: (cartId: number) => {
    return api.delete(`/carts/${cartId}`);
  },
  //   create: (data: { productId: number }) => {
  //     return api.post("/carts",{
  //         data :data
  //     });
  //   },
};

export const getCartItems = () => {
  return api.get("/carts");
};

export default orderApi;
