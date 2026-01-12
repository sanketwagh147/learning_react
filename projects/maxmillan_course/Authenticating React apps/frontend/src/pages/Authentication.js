import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const data = await request.formData();
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  if (mode !== 'login' && mode !== 'signup'){
    throw json({message:'Unsupported mode'}, {status:422})
  }

  const authData = {
    email: data.get('email'),
    password: data.get('password'),
  };

  console.error(authData);
  
  const url = 'http://localhost:8080/' + mode

  const headers = {
    'Content-Type': 'application/json'
  }

  const response = await fetch(url,{method:'POST',headers: headers,body:JSON.stringify(authData) })

  if (response.status === 422 || response.status === 401){
    return response
  }

  if (!response.ok){
    throw json({message:"Could not authenticate user"}, {status:500})

  }

  const resData = await response.json()
  const token = resData.token;
  // store in memory / cookie or / local storage

  localStorage.setItem('token', token)

  return redirect('/')
}
