import clsx from 'clsx'

const TextInput = ({placeholder, onChange, value, type, className, ...props}) => {

  return (
    <input
        type={type}
        placeholder={placeholder}
        className={clsx('bg-[#0e0e0e] text-white placeholder:text-[#666666] px-3 py-2 outline-0 rounded', className)}
        value={value}
        onChange={onChange}
        required
        {...props}
    />
  )
}

export default TextInput