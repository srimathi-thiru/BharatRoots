import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function HeritageList() {

  const [heritageList, setHeritageList] = useState([]);

  useEffect(() => {
    fetchHeritage();
  }, []);

  const fetchHeritage = async () => {

    const querySnapshot = await getDocs(collection(db, "heritage"));

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    setHeritageList(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>BharatRoots Heritage</h1>

      {heritageList.map(item => (
        <div key={item.id} style={{
          border: "1px solid gray",
          margin: "10px",
          padding: "10px"
        }}>
          <h3>{item.title}</h3>
          <p>Category: {item.category}</p>
          <p>Region: {item.region}</p>
          <p>{item.description}</p>
        </div>
      ))}

    </div>
  );
}

export default HeritageList;
