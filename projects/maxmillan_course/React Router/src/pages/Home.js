import { Link,useNavigate } from "react-router-dom";
function HomePage() {

  // Navigate programmatically using useNavigate hook
  const navigate=useNavigate();

  const goToProductsHandler=()=>{
    navigate('products');
  }
  return (
    <>
      <h1>My Home Page</h1>
      <p>Go to <Link to="products">Products</Link></p>
      <p><button onClick={goToProductsHandler}>Go to Products using navigate()</button></p>
    </>
  );
}

export default HomePage;
