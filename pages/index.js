import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

function Home(props) {
    const [visibleOrigin, setVisibleOrigin] = useState(false);
    const [visibleResi, setVisibleResi] = useState(false);
    const [visibleDesti, setVisibleDesti] = useState(false);
    const [kotaAsal, setKotaAsal] = useState("");
    const [namaKotaAsal, setNamaKotaAsal] = useState("");
    const [kotaTujuan, setKotaTujuan] = useState("");
    const [namaKotaTujuan, setNamaKotaTujuan] = useState("");
    const [berat, setBerat] = useState("");
    const [dataOngkir, setDataOngkir] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [resultManifest, setManifest] = useState({});
    const [notifBill, setNotifBill] = useState("");
    const [error, setError] = useState(false);
    const [kota, setKota] = useState([]);

    const selectOriginCity = (e) => {
        setNamaKotaAsal(event.target.options[event.target.selectedIndex].text);
        setKotaAsal(e.target.value);
        setVisibleOrigin(false);
    };

    const selectDestination = (e) => {
        setNamaKotaTujuan(event.target.options[event.target.selectedIndex].text);
        setKotaTujuan(e.target.value);
        setVisibleDesti(false);
    };

    const cekOngkir = (e) => {
        setLoading(true);
        axios
            .post("https://ongkir-api.vercel.app/cek_harga", {
                kota_asal: kotaAsal,
                type_asal: "city",
                kota_tujuan: kotaTujuan,
                type_tujuan: "city",
                berat: berat,
            })
            .then((res) => {
                setLoading(false);
                setDataOngkir(res.data.data.results);
            });
    };

    const cekResi = (e) => {
        e.preventDefault();
        setError(false);
        axios
            .post("https://ongkir-api.vercel.app/check_resi", {
                resi: data.resi,
                kurir: data.kurir,
            })
            .then((res) => {
                if (res.data.data.status.code === 200) {
                    setManifest(res.data.data.result.manifest);
                } else {
                    setError(true);
                    setNotifBill("No Resi tidak terdaftar.");
                }
            });
    };

    useEffect(() => {
        axios.get("https://ongkir-api.vercel.app/kota").then((res) => setKota(res.data.data));
    }, []);

    return (
        <>
            {visibleResi && (
                <div className="h-screen w-full absolute">
                    <div
                        onClick={(e) =>
                            setVisibleResi((prevState) => {
                                !prevState;
                                setManifest({});
                                setError(false);
                                setData({});
                            })
                        }
                        className="bg-black absolute h-screen w-full opacity-50 z-20"
                    ></div>
                    <ModalResi className="bg-white p-5 left-0 right-0 rounded-lg absolute z-50">
                        <h1 className="text-3xl text-grey-500 font-semibold">Pilih Kota Asal</h1>
                        <select className="w-full p-5 mt-3 bg-gray-300 rounded-lg focus:outline-none" onChange={(e) => setData({ ...data, kurir: e.target.value })}>
                            <option>Pilih Kurir</option>
                            <option value="jne">JNE</option>
                            <option value="jnt">J&T</option>
                            <option value="sicepat">Sicepat</option>
                            <option value="pos">POS Indonesia</option>
                            <option value="tiki">Tiki</option>
                            <option value="ninja">Ninja Express</option>
                            <option value="wahana">Wahana</option>
                        </select>
                        <input
                            type="text"
                            className="w-full p-5 mt-3 bg-gray-300 rounded-lg focus:outline-none"
                            placeholder="Masukan no resi anda"
                            required
                            onChange={(e) => setData({ ...data, resi: e.target.value })}
                        />
                        <button className="p-5 text-white bg-green-500 rounded w-full mt-3" onClick={(e) => cekResi(e)}>
                            Cek Resi
                        </button>
                        {error && <div className="bg-orange-500 p-4 mt-3 text-white">{notifBill}</div>}
                        {resultManifest.length > 0 && (
                            <div className="mt-5 overflow-y-auto" style={{ height: "30rem" }}>
                                <h4>Details</h4>
                                {resultManifest.map((item) => (
                                    <div className="flex-col mb-4 mt-5">
                                        <h4>
                                            {item.city_name} ({item.manifest_description})
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {item.manifest_date} {item.manifest_time}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ModalResi>
                </div>
            )}
            {visibleOrigin && (
                <div className="h-full w-full">
                    <div onClick={(e) => setVisibleOrigin(false)} className="bg-black absolute h-full w-full opacity-50 z-20"></div>
                    <Modal className="bg-white bottom-0 p-5 left-0 right-0 rounded-t-lg absolute z-50">
                        <h1 className="text-3xl text-grey-500 font-semibold">Pilih Kota Asal</h1>
                        <select className="w-full p-5 mt-3 bg-gray-300 rounded-lg focus:outline-none" onChange={(e) => selectOriginCity(e)}>
                            {kota.results.map((item) => (
                                <option value={item.city_id}>{item.city_name}</option>
                            ))}
                        </select>
                    </Modal>
                </div>
            )}
            {visibleDesti && (
                <div className="h-full w-full">
                    <div onClick={(e) => setVisibleDesti(false)} className="bg-black absolute h-full w-full opacity-50 z-20"></div>
                    <Modal className="bg-white bottom-0 p-5 left-0 right-0 rounded-t-lg absolute z-50">
                        <h1 className="text-3xl text-grey-500 font-semibold">Pilih Kota Tujuan</h1>
                        <select className="w-full p-5 mt-3 bg-gray-300 rounded-lg focus:outline-none" onChange={(e) => selectDestination(e)}>
                            {kota.results.map((item) => (
                                <option value={item.city_id}>{item.city_name}</option>
                            ))}
                        </select>
                    </Modal>
                </div>
            )}
            <Section>
                <Section2>
                    <header className="flex items-center justify-between p-5">
                        <h1 className="text-2xl uppercase text-blue-500">CEKKURIR</h1>
                        <button onClick={(e) => setVisibleResi(true)} className="p-2 border-2 border-blue-500 rounded text-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none">
                            Cek Resi
                        </button>
                    </header>
                    <div className="bg-blue-400 p-5 border-l-4 border-blue-700 mb-5">
                        <p className="text-white text-1xl">Website untuk cek resi dan cek ongkir.</p>
                    </div>
                    <div className="mb-2 mx-5">
                        <div onClick={(e) => setVisibleOrigin((prevState) => !prevState)} className="bg-white p-5 rounded-lg flex items-center justify-between">
                            <h4>Kota Asal</h4>
                            <h4>{namaKotaAsal}</h4>
                            <button className="rounded bg-gray-300 p-3 px-4 inline-flex items-center relative hover:bg-gray-400 focus:outline-none">
                                Pilih
                                <svg viewBox="0 0 24 24" focusable="false" role="presentation" className="ml-2 h-6 w-6 inline-block">
                                    <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="mb-2 mx-5">
                        <div onClick={(e) => setVisibleDesti((prevState) => !prevState)} className="bg-white p-5 rounded-lg flex items-center justify-between">
                            <h4>Kota Tujuan</h4>
                            <h4>{namaKotaTujuan}</h4>
                            <button className="rounded bg-gray-300 p-3 px-4 inline-flex items-center relative hover:bg-gray-400 focus:outline-none">
                                Pilih
                                <svg viewBox="0 0 24 24" focusable="false" role="presentation" className="ml-2 h-6 w-6 inline-block">
                                    <path fill="currentColor" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="mb-5 mx-5">
                        <div className="bg-white p-5 rounded-lg flex items-center justify-between">
                            <input onChange={(e) => setBerat(e.target.value)} type="text" placeholder="Berat" className="p-3 bg-gray-200 rounded-lg focus:outline-none" />
                            <h4 className="mr-5">(Gram)</h4>
                        </div>
                    </div>
                    <div className="mb-5 mx-5">
                        <button onClick={(e) => cekOngkir(e)} className="bg-green-500 rounded-lg p-5 w-full text-white shadow hover:bg-green-600" disabled={loading}>
                            {loading ? "Please wait" : "Cek Ongkir"}
                        </button>
                    </div>
                    {dataOngkir.map((item) => (
                        <div className="">
                            {item.costs.map((data) => (
                                <div className="mb-2 mx-5 rounded-lg bg-white p-5 flex items-center justify-between">
                                    <h4 className="uppercase">{item.code}</h4>
                                    <div className="flex-col">
                                        <h4>{data.service}</h4>
                                    </div>
                                    {data.cost.map((cost) => (
                                        <div className="flex-col text-right">
                                            <h4>{cost.etd} Hari</h4>
                                            <p>Rp {cost.value}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </Section2>
            </Section>
            <Footer>
                <p className="ml-4">
                    Build with<span className="mr-2">❤</span>Apsyadira
                </p>
            </Footer>
        </>
    );
}

const Section = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 32rem;
    background-color: #edf2f7;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    padding-bottom: 4rem;
    overflow-y: auto;
    height: calc(var(--vh, 1vh) * 90);
`;

const Footer = styled.div`
    justify-content: space-between;
    position: absolute
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 2rem;
    padding-bottom: 2rem;
    width: 100%;
    max-width: 32rem;
    margin-left: auto;
    margin-right: auto;
`;

const Section2 = styled.div`
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
`;

const Modal = styled.div`
    margin: 0px auto;
    max-width: 32rem;
    width: 100%;
    height: 22rem;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
`;

const ModalResi = styled.div`
    margin: 5em auto;
    max-width: 32rem;
    width: 100%;
`;

export default Home;
