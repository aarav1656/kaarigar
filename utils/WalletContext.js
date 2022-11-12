import React, {useState,useEffect, createContext} from 'react'
import { useAccount } from '@rainbow-me/rainbowkit';


export const WalletContext = createContext([])

const WalletProvider = ({children}) => {
    const { address,isDisconnected } = useAccount({
        onConnect ({ address, connector, isReconnected }) {
          console.log('onConnect', address, connector, isReconnected)
        }
      })
      const [token, setToken] = useState(null)
      const [user, setUser] = useState(null)

        useEffect(() => {
            if(address){
                fetchToken()
            }
            }, [address])

      // useEffect(() => {
      //   console.log('signer isError isLoading', signer, isError, isLoading)
      //   if (signer && address) {
      //     refetchToken()
      //   }
      // }, [signer, address])

      const fetchToken = async () => {
        // return;
        try {
          existingToken = getLocalToken()
          console.log(existingToken)
          if (existingToken) {
            setToken(existingToken)
          }
        } catch (error) {
          console.log(error)
        }
        
      }
  return (
  <WalletContext.Provider value={{token, setToken}}>
    {children}
  </WalletContext.Provider>
    )
}

export default WalletProvider