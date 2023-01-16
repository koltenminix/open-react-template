import React, {useEffect, useState} from 'react';
import {Button, Modal, Image} from 'semantic-ui-react';
import BlokeDex from "./BlokeDex";
import Web3 from "web3";
import ABI from "../../mintAbi.json";
import Bloke from "./Bloke";

function Header() {
    const [errorMessage, setErrorMessage] = useState('');
    const [walletDisplay, setWalletDisplay] = useState('');
    const [open, setOpen] = React.useState(false);
    const [nfts, setNfts] = useState([])
    const [noMintsMessage, setMintsMessage] = useState('');


    // NFT Show Func
    const showNfts = async () => {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const contract = await new web3.eth.Contract(ABI, "0x931f88Fc7f13217ca30e5bd9AC9261a47A95DBd1");
        const nftBalance = await contract.methods.balanceOf(accounts[0]).call();// get balance of id
        let rows = []; // empty array;
        for (let i = 0; i < nftBalance; i++) {
            try {
                let tokenId = await contract.methods.tokenOfOwnerByIndex(accounts[0], i).call();
                let response = await fetch(`https://gateway.pinata.cloud/ipfs/QmcGUYsNBuuV7eFASQTeueHQiSDSZCxKxzqEH9uBMaB3z9/${tokenId}.json`)
                let data = await response.json();
                console.log(tokenId);
                rows.push(data);
            } catch (e) {
                setErrorMessage(e.reason);
            }


        }
        let walletString = accounts[0].substring(0,4) + "...." + accounts[0].substring(accounts[0].length - 4) ;
        setWalletDisplay(walletString);
        setNfts(rows)
    }


    const checkWalletMints = async () =>{
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        const contract = await new web3.eth.Contract(ABI, "0x931f88Fc7f13217ca30e5bd9AC9261a47A95DBd1");
        const mints = await contract.methods.mintedWallets(accounts[0]).call();// get amount of what has been minted from the contract
        if(!(mints > 0)){
            setMintsMessage("You don't have any Blokés! Scroll down to mint some!");

        }else{
            setMintsMessage("BLOKéDEX");

        }

    }
    useEffect(() => {
        checkWalletMints();
    }, []);






    return (

        <Modal

            basic
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size="large"
            onClick={showNfts}
            trigger={<Button color='black'>{noMintsMessage} </Button>}
            style={{width:'95%', height:'100%'}}
        >
            <Modal.Header>
                BLOKéDEX
                <Button floated='right' color='black' icon='close' onClick={() => setOpen(false)}/>
                <div style={{float:'right'}}>{walletDisplay}</div>
            </Modal.Header>

            <Modal.Content>
                <Bloke blokeData={nfts} ></Bloke>
            </Modal.Content>

        </Modal>
    )
}

export default Header;
