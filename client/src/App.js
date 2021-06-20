import React, { useState, useEffect } from "react";
import axios from 'axios';
import { render } from "react-dom";
import { Resizable } from "re-resizable";
import Modal from 'react-modal';

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",

  margin: "60px 60px 30px 60px",
  border: "1px solid black",
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const App = () => {
  const [component1, setComponent1] = useState({
    width: 300,
    height: 300
  });
  const [component2, setComponent2] = useState({
    width: 300,
    height: 300
  });
  const [component3, setComponent3] = useState({
    width: 720,
    height: 340
  });
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [text, setText] = useState("");
  const [updatedId, setUpdatedId] = useState(null);
  const [count, setCount] = useState(null);



  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      // get data list 
      const { data } = await axios.get("http://localhost:1234/data/list")
      console.log("response", data);
      setData(data.data);

      // get counter
      const response = await axios.get("http://localhost:1234/counter/get");
      // console.log("response======>", response.data);
      
      if (response.data.count && response.data.count.length) {

        setComponent3({
          ...component3,
          height: response.data.count[0].height
        })
        setCount(response.data.count[0].count || 0);
      }else{
        setCount(0);
      }
      setLoading(false);

     


    }
    getData()
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();

    // calling add api
    await axios.post("http://localhost:1234/data/add", { name: e.target.data.value });

    // calling data list after add
    const { data } = await axios.get("http://localhost:1234/data/list");
    // setting data 
    setData(data.data);
    setText("");
    // setting component 3 height
    setComponent3({
      ...component3,
      height: component3.height + 50
    })

    // updating the counter when data is added
    await axios.post("http://localhost:1234/counter/update", { height: component3.height + 50 });

    // get list of data when updated

    const response = await axios.get("http://localhost:1234/counter/get");

    setCount(response.data.count[0].count);
  }

  const handleChange = (e) => {
    setText(e.target.value);
  }


  function openModal(id, e) {
    setIsOpen(true);
    console.log("update id", id);
    setUpdatedId(id);

  }
  function closeModal() {
    setIsOpen(false);
  }
  const updateData = async (e) => {
    e.preventDefault();
    await axios.put("http://localhost:1234/data/update/" + updatedId, { updatedName: e.target.data.value });
    const { data } = await axios.get("http://localhost:1234/data/list");
    setData(data.data);
  }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.

  }
  console.log("component3", component3, loading);
  return !loading && (
    <>
      <div style={{ display: "flex" }}>
        <Resizable
          style={{ ...style, overflow: "scroll" }}
          size={{ width: component1.width, height: component1.height }}
          onResizeStop={(e, direction, ref, d) => {
            console.log(d.height);
            setComponent1({
              ...component1,
              width: component1.width + d.width,
              height: component1.height + d.height
            });
            setComponent2({
              ...component2,
              width: component2.width - d.width,
              height: component2.height
            });

            setComponent3({
              ...component3,
              width: component3.width,
              height: component3.height - d.height
            });
          }}
        >
          <form onSubmit={handleSubmit}>
            <input onChange={handleChange} name="data" placeholder="Add data" required value={text} />
            <button type="submit">Add</button>
          </form>
        </Resizable>
        <Resizable
          style={style}
          size={{ width: component2.width, height: component2.height }}
          onResizeStop={(e, direction, ref, d) => {
            console.log("d", d);
            console.log(component2.width + d.width);
            setComponent2({
              ...component2,
              width: component2.width + d.width,
              height: component2.height + d.height
            });
            // if(component1.width - d.width < 300)
            setComponent1({
              ...component1,
              width: component1.width - d.width,
              height: component1.height
            });
            setComponent3({
              ...component3,
              width: component3.width,
              height: component3.height - d.height
            });
          }}
        >
          <h1>Count: {count}</h1>

        </Resizable>
      </div>
      <div>
        <Resizable
          style={{ ...style, overflow: "scroll" }}
          size={{ width: component3.width, height: component3.height }}
          onResizeStop={(e, direction, ref, d) => {
            setComponent3({
              ...component3,
              width: component3.width + d.width,
              height: component3.height + d.height,
            });
            setComponent1({
              ...component1,
              height: component1.height - d.height,
              width: component1.width
            })
            setComponent2({
              ...component2,
              height: component2.height - d.height,
              width: component2.width
            })
          }}
        >
          <table style={{ overflow: "scroll" }} class="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.length ?
                data.map((d) => <tr key={d._id}>
                  <td>{d.name}</td>
                  <td><button onClick={(e) => openModal(d._id, e)}>Update</button></td>
                </tr>)


                : <h1 style={{ textAlign: "center" }}>No Data found ...</h1>}
            </tbody>
          </table>
        </Resizable>
      </div>
      <div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          
          <form onSubmit={updateData}>
            <input name="data" />
            <button>submit</button>
            <button onClick={closeModal}>close</button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default App;

