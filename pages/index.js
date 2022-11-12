import { useEffect, useState, useContext } from 'react'
import { ethers } from 'ethers'
import { client, challenge, authenticate } from '../utils/api'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {WalletContext} from '../utils/WalletContext.js'
import {useAccount} from 'wagmi'

export default function Home() {
  /* local state variables to hold user's address and access token */
  const { address, isDisconnected } = useAccount()
  const {setToken, token} = useContext(WalletContext);

  
 
  async function login() {
    try {
      /* first request the challenge from the API server */
      const challengeInfo = await client.query({
        query: challenge,
        variables: { address }
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signer.signMessage(challengeInfo.data.challenge.text)
      /* authenticate the user */
      const authData = await client.mutate({
        mutation: authenticate,
        variables: {
          address, signature
        }
      })
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const { data: { authenticate: { accessToken }}} = authData
      console.log({ accessToken })
      setToken(accessToken)
      localStorage.setItem('token', token)
    } catch (err) {
      console.log('Error signing in: ', err)
    }
  }

  return (
    <div>
      { /* if the user has not yet connected their wallet, show a connect button */ }
      {
        isDisconnected && (<ConnectButton />)
      }
      { /* if the user has connected their wallet but has not yet authenticated, show them a login button */ }
      {
        address && !token && (
          <div onClick={login}>
            <button>Login</button>
          </div>
        )
      }
      { /* once the user has authenticated, show them a success message */ }
      {
        address && token && <h2>Successfully signed in!</h2>
      }
    </div>
  )
}