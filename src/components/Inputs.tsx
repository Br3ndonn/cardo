import { useRef, useState } from "react"
import { secondsToStr, strToSeconds } from "../utils/utils"


export enum SwitchState {
  False,
  None,
  True
}


export function Switch({ state, setState, labels }: {
  state: SwitchState,
  setState: (state: SwitchState) => void,
  labels: [string, string]
}) {


  return (
    <div className="grid grid-cols-3 gap-1 uppercase items-center align-middle">
      <p className="text-right">{labels[0]}</p>
      <div className="bg-zinc-300 border-2 border-zinc-800 h-5 rounded-md overflow-hidden flex w-fit mx-auto">
        <input type="radio" checked={state === SwitchState.False} onChange={() => setState(SwitchState.False)}
          className="w-5 h-full appearance-none checked:bg-blue-500" />
        <input type="radio" checked={state === SwitchState.None} onChange={() => setState(SwitchState.None)}
          className="w-5 h-full appearance-none checked:bg-primary-5" />
        <input type="radio" checked={state === SwitchState.True} onChange={() => setState(SwitchState.True)}
          className="w-5 h-full appearance-none checked:bg-green-500" />
      </div>
      <p className="text-left">{labels[1]}</p>
    </div>
  )
}


export function Checkbox({ onChange, defaultChecked = false }: { onChange: (value: boolean) => void, defaultChecked?: boolean }) {


  return (
    <div className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="hidden peer"
        defaultChecked={defaultChecked}
        onChange={(e) => {
          onChange(Boolean(e.target.checked))
        }}
      />
      <span className="text-transparent peer-checked:text-black bg-white text-lg font-bold flex justify-center items-center h-5 w-5 text-center border-2 border-primary-2 transition duration-100 ease-in-out rounded-md m-1">
        ✓
      </span>
    </div>
  )
}


export function AutocompleteInput({ value, callback, options, className }: {
  value: string,
  callback: (value: string) => void,
  options: typeof value[],
  className?: string
}) {

  const inputRef = useRef<HTMLInputElement>(null)
  const [showOptions, setShowOptions] = useState<typeof value[]>([])

  return (
    <div className={'relative flex flex-col items-center ' + className}>
      <input
        ref={inputRef}
        type="text"
        className='bg-primary-8 rounded-md px-2 py-1 focus:outline-none w-full'
        defaultValue={value}
        onChange={e => {
          if (options.includes(e.target.value)) {
            callback(e.target.value)
          }

          setShowOptions(
            options.filter(option => option.includes(e.target.value))
          )
        }}
        onSubmit={() => setShowOptions([])}
      />
      <div className="absolute top-10 flex flex-col items-center w-full rounded-md overflow-hidden h-36 overflow-y-auto">
        {
          showOptions.map(option => (
            <button key={option}
              className='w-full p-1 bg-primary-7 hover:bg-primary-6'
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = option
                  callback(option)
                  setShowOptions([])
                }
              }}
            >
              {option}
            </button>
          ))
        }
      </div>
    </div>
  )
}


export function TimeInput({ value, onChange }: { value: number, onChange: (t: number) => void }) {

  return (
    <input
      type="text"
      pattern="^(\d{1,2}:)?(\d{1,2}:)?\d{1,2}$"
      placeholder="hh:mm:ss"
      title="hh:mm:ss / mm:ss / ss"
      maxLength={8}
      className="h-5 text-center bg-primary-8 rounded-md invalid:text-red-600 w-20 px-2 py-1"
      defaultValue={secondsToStr(value, true)}
      onChange={e => {
        if (e.target.validity.valid) {
          const newVal = strToSeconds(e.target.value)
          onChange(newVal)
        }
      }
      }
      onBlur={e => {
        e.target.value = secondsToStr(strToSeconds(e.target.value), true) // formatting
      }
      }
    />
  )
}