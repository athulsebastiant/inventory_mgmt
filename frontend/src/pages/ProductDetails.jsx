import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const ProductDetails = () => {
  const params = useParams();
  console.log(params);
  const [productinfo, setProductInfo] = useState(null);

  async function getProduct() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${params.id}`
      );
      console.log(response);
      setProductInfo(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getProduct();
  }, [params.id]);
  console.log(productinfo);

  return (
    <div>
      {productinfo ? (
        <div>
          {productinfo.imagesUrl[0] ? (
            <img src={productinfo.imagesUrl[0]} alt="" />
          ) : null}
          {productinfo.imagesUrl[1] ? (
            <img src={productinfo.imagesUrl[1]} alt="" />
          ) : null}
          {productinfo.imagesUrl[2] ? (
            <img src={productinfo.imagesUrl[2]} alt="" />
          ) : null}
          {productinfo.imagesUrl[3] ? (
            <img src={productinfo.imagesUrl[3]} alt="" />
          ) : null}
          <h2>{productinfo.name}</h2>
          <p>sku: {productinfo.sku}</p>
          <p>{productinfo.category}</p>
          <p>{productinfo.description}</p>
          <p>current stock: {productinfo.currentStock}</p>
          <p>reorder level: {productinfo.reorderLevel}</p>
        </div>
      ) : (
        <h2></h2>
      )}
    </div>
  );
};

export default ProductDetails;
