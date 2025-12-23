import { useState } from "react";

export default function Login() {

  const [enteredValues, setEnteredValues] = useState({email:"", password:""});
  const [editedValues, setEditedValues] = useState({email:false, password:false});

  function handleSubmit(event) {
    console.log("submitted");
    
    event.preventDefault();
    console.log(enteredValues);
    
    // Handle login logic here
  }


  function handleInputChange(event) {
    const { name, value } = event.target;
    setEnteredValues(prevValues => ({...prevValues, [name]: value}));
  }

  function handleBlur(event) {
    console.log("Blurred:", event.target.name);
    const { name } = event.target;
    setEditedValues(prevValues => ({...prevValues, [name]: true}));
  }


  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <div className="control no-margin">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" onChange={handleInputChange} value={enteredValues.email} onBlur={handleBlur} />
          <div className="control-error">{editedValues.email && enteredValues.email.trim() === "" && "Email is required"}</div>
        </div>

        <div className="control no-margin">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" onChange={handleInputChange} value={enteredValues.password} onBlur={handleBlur}/>
          <div className="control-error">{editedValues.password && enteredValues.password.trim() === "" && "Password is required"}</div>
        </div>
      </div>

      <p className="form-actions">
        <button className="button button-flat">Reset</button>
        <button type="submit" className="button" >Login</button>
      </p>
    </form>
  );
}
