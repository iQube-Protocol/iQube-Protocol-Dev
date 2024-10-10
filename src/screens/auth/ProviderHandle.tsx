import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ThirdWebConnect from '../../components/ThirdWebConnect'
import { useActiveAccount } from 'thirdweb/react'
import { isValidKnytUsername } from '../../utilities'
import request, { methods } from '../../utilities/http'
const ProviderHandle = () => {
  const [handle, setHandle] = useState('')
  const [publicAddress, setPublicAddress] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [btnText, setBtnText] = useState('Map Handle')
  const _account = useActiveAccount()

  useEffect(() => {
    console.log(_account)
    if (_account) {
      setPublicAddress(_account.address)
      setIsLoading(false)
    }
  }, [_account])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setBtnText('Creating...')

    try {
      isValidKnytUsername(handle)
      let req = await request('/accounts', methods.POST, {
        handle,
        publicAddress,
      })

      if (req.success) {
        // redirect to home
        window.location.href = '/thirdweb'
      } else {
        setError(req.message || 'An error occurred during the request')
      }
    } catch (error) {
      console.error('Error:', error) // Log the error for debugging
      setError(
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'An unknown error occurred!',
      )
    } finally {
      setBtnText('Create')
    }
  }

  if (isLoading) {
    return (
      <div className="center-container flex flex-col items-center">
        <p className="text-[11px] text-gray-500">Please Wait...</p>
        <ThirdWebConnect />
      </div>
    )
  }

  return (
    <div className="center-container">
      <div className="w-[40%]">
        <h2 className="text-underline">Map Your Preferred Handle</h2>
        <p className="text-[17px] text-gray-500 mb-[20px]">
          Map your handle to your public key, to easily share and receive Qubes.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Handle. e.g. king@knyt"
            required
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-[60px] px-[40px]"
          />
          {error && (
            <p className="text-red-500 text-[11px] text-center text-[#FF0000] mb-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={btnText === 'Creating...'}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {btnText}
          </button>
          <Link to="/thirdweb" className="text-blue-500 text-center">
            Go to App
          </Link>
        </form>
        <div className="mt-4 flex justify-center">
          <ThirdWebConnect />
        </div>
      </div>
    </div>
  )
}

export default ProviderHandle
