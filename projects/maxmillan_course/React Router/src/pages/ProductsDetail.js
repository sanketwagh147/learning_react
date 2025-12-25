import { Link, useParams } from "react-router-dom";

function ProductDetail() {
  const params = useParams();
  return ( 
    <>
      <h1>Product Detail Page for {params.productId} </h1>
      <p>Here are the details of the selected product.</p>
      <p><Link to=".." relative="path">Back to Products</Link></p>
      {/* <p><Link to=".." relative="route">This is example of relative route</Link></p>  */} 
    </>
   );
}

export default ProductDetail;