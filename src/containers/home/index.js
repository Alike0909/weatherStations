import React, { useEffect, useState } from 'react'
import { Layout, Select, Table, Tag, Space } from 'antd';
import './index.css'

import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import app from '../../firebase'
import Item from 'antd/lib/list/Item';
const db = getFirestore();

function Home() {

    const { Header, Content } = Layout;
    const { Option } = Select;

    const [allArea, setAllArea] = useState([])
    const [allRegion, setAllRegion] = useState([])
    const [allStation, setAllStation] = useState([])
    const [allFiles, setAllFiles] = useState([])

    const [region, setRegion] = useState([])
    const [station, setStation] = useState([])
    const [tempStation, setTempStation] = useState(``)
    const [file, setFile] = useState([])

    const [defaultRegion, setDefaultRegion] = useState({ children:`Выберите район` })
    const [defaultStation, setDefaultStation] = useState({ children:`Выберите метеостанцию` })

    async function fetchArea() {
        let data = await getDocs(query(collection(db, "area"), orderBy('id', 'asc')))
        setAllArea(data.docs)
    }

    async function fetchRegion() {
        let data = await getDocs(query(collection(db, "region"), orderBy('id', 'asc')))
        setAllRegion(data.docs)
    }

    async function fetchStation() {
        let data = await getDocs(query(collection(db, "station"), orderBy('id', 'asc')))
        setAllStation(data.docs)
    }

    async function fetchFiles() {
        let data = await getDocs(query(collection(db, "files"), orderBy('station', 'asc')))
        setAllFiles(data.docs)
    }

    async function onChangeArea(value) {
        setFile([])
        setRegion([])
        setStation([])
        for (let i in allRegion) {
            if (allRegion[i].data().area === value) {
                setRegion(prev => [...prev, allRegion[i]])
            }
        }
        setDefaultRegion({ children: `Выберите район` })
        setDefaultStation({ children:`Выберите метеостанцию` })
    }

    async function onChangeRegion(value) {
        setFile([])
        setStation([])
        for (let i in allStation) {
            if (allStation[i].data().region === value) {
                setStation(prev => [...prev, allStation[i]])
            }
        }
        setDefaultStation({ children: `Выберите метеостанцию` })
    }

    function onChangeStation(value) {
        setFile([])
        for (let i in allFiles) {
            if (allFiles[i].data().station === value) {
                setFile(allFiles[i].data().links)
            }
        }
    }

    function onSelect(value, data) {
        if (data.name == "region") {
            setDefaultRegion(data)
        } else if (data.name == "station") {
            setDefaultStation(data)
        }
    }

    const decorator = (amount) => {
        const count = 4 - amount
        const arr = Array.from(Array(count).keys())
        
        return (
            arr.map((item, i) =>
                <div className="content-container-item faded" key={i}>
                    <div className="img"></div>
                    <div className="desc">
                        <h3>
                            Пустой
                        </h3>
                    </div>
                </div>
            )
        )
    }

    useEffect(() => {
        fetchArea()
        fetchRegion()
        fetchStation()
        fetchFiles()
    }, [])

    return (
        <div className="home">
            <Layout style={{background: 'none'}}>
                <Header>
                    <div className="container">
                        <div className="header-container-item" style={{flexDirection: 'row', alignItems: 'center'}}>
                            <h1>Kazakh National Agrarian Research University</h1>
                        </div>
                        <div className="header-container-item">
                            <h4>Область</h4>
                            <Select
                                size="large"
                                placeholder="Выберите область"
                                onChange={onChangeArea}
                            >
                                {allArea.map((item, i) => 
                                    <Option value={item?.data().id} key={i}>{item?.data().name}</Option>
                                )}
                            </Select>
                        </div>
                        <div className="header-container-item">
                            <h4>Район</h4>
                            <Select
                                value={defaultRegion.children}
                                size="large"
                                onChange={onChangeRegion}
                                onSelect={onSelect}
                                disabled={region.length === 0 ? true : false}
                            >
                                {region.map((item, i) =>
                                    <Option name="region" value={item?.data().id} key={i}>{item?.data().name}</Option>
                                )}
                            </Select>
                        </div>
                        <div className="header-container-item">
                            <h4>Метеостанция</h4>
                            <Select
                                value={defaultStation.children}
                                size="large"
                                onChange={(value) => {
                                    setFile([])
                                    setTempStation(value)
                                }}
                                onSelect={onSelect}
                                disabled={station.length === 0 ? true : false}
                            >
                                {station.map((item, i) =>
                                    <Option name="station" value={item?.data().id} key={i}>{item?.data().name}</Option>
                                )}
                            </Select>
                        </div>
                        <div className="header-container-item">
                            <button onClick={() => onChangeStation(tempStation)}>Поиск</button>
                        </div>
                    </div>
                </Header>
                <Content>
                    <div className="container flex-wrap-container">
                        {file.map((item, i) => 
                            <a href={item}>
                                <div className="content-container-item" key={i}>
                                    <div className="img"></div>
                                    <div className="desc">
                                        <h3>
                                            {defaultStation.children}
                                            <span style={{marginLeft: '3px'}}>{i == 0 ? "температура" : "осадки"}</span>
                                        </h3>
                                    </div>
                                </div>
                            </a>
                        )}
                        {decorator(file.length)}
                    </div>
                </Content>
            </Layout>
        </div>
    )
}

export default Home