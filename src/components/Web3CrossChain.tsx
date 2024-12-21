import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'

export default function Web3CrossChain() {
  const [fromChain, setFromChain] = useState('Amoy')
  const [toChain, setToChain] = useState('Avalanche')
  const [tokenId, setTokenId] = useState('')

  const handleSwap = () => {
    setFromChain(toChain)
    setToChain(fromChain)
  }

  const sameChainTransfer = async () => {
    try {
      // TODO: Implement same chain transfer logic
      throw new Error('Not implemented')
    } catch (error) {
      console.error(error)
    }
  }

  const bridgeTransfer = async () => {
    try {
      // TODO: Implement bridge transfer logic
      throw new Error('Not implemented')
    } catch (error) {
      console.error(error)
    }
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`Transferring token ${tokenId} from ${fromChain} to ${toChain}`)

    if (fromChain === toChain) {
      void sameChainTransfer()
    } else {
      void bridgeTransfer()
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Cross-Chain Qube Transfer
        </h2>
        <form onSubmit={handleTransfer}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md"
              value={fromChain}
              onChange={(e) => setFromChain(e.target.value)}
            >
              <option value="Amoy">Amoy</option>
              <option value="Avalanche">Avalanche</option>
            </select>
          </div>
          <div className="flex justify-center my-1">
            <div className="bg-[#f6f6f6] h-[50px] w-[50px] rounded-[10px] flex items-center justify-center">
              <ArrowUpDown
                color="grey"
                onClick={handleSwap}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md"
              value={toChain}
              onChange={(e) => setToChain(e.target.value)}
            >
              <option value="Amoy">Amoy</option>
              <option value="Avalanche">Avalanche</option>
            </select>

            <div className="mt-[20px]">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dest. Address
              </label>
              <input type="text" placeholder="0x ..." className="w-[100%]" />
            </div>
          </div>
          <div className="flex justify-center">
            <hr className="w-[50%] my-[20px] border-[#f6f6f6]" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qube ID
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Transfer
          </button>
        </form>
      </div>
    </div>
  )
}
