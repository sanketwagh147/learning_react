import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home';
import ProductsPage from './pages/Products';
import RootLayout from './pages/Root';
import ErrorPage from './pages/ErrorPage';
import ProductDetail from './pages/ProductsDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage/>,
    children: [
      {
        // path: '/',
        index: true, // this will make it default child route which is equivalent to path:''
        element: <HomePage />,
      },
      {
        // path: '/products',  // this is absolute path 
        path: 'products', // this is relative path will use parent path defined in above route not in child list
        element: <ProductsPage />,
        // errorElement: <ErrorPage/>
      },{
        path: 'products/:productId',
        element: <ProductDetail/>,
        // errorElement: <ErrorPage/>
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
