
import { useState } from 'react';
import './App.css';
import useDebounce from './useDebounce';

function App() {
  const [data, setData] = useState(null);

  const loadData = async (e)=>{
    const value = e.target.value;
    if(value === ''){
      setData(null);
      return;
    } 
    const response=await fetch(`http://localhost:3001/data/${value}`);
    const res=await response.json()
    console.log("response",res)
    setData(res);
  }
  const loadDataDebounced = useDebounce(loadData, 400)

  return (
    <div className="App">
        <input type='text' placeholder = 'Enter Something' onChange={(e)=> loadDataDebounced(e)}/>
        {data && data.length !== 0  &&
          <div className='results-container'>
            {data.map(item=>(
              <div key={item.id} className="result-item">
                 <p> {item.city} </p>
              </div>
            ))}
          </div>
        }
    </div>
  );
}

export default App;
