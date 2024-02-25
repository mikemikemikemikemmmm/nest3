import { Theme } from "@emotion/react"
import { SxProps, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
interface Props {
    label: string
    value: string | number
    onChange: (val: string) => void
    error: boolean
    sx?: SxProps<Theme>
    disabled?: boolean
    config?: object
}
const stringHelperText = "Can't be empty."
const numHelperText = "Only accept non-zero positive integer."
export const FieldWrapper = (props: Props) => {
    const { config, disabled, error, value, sx, onChange, label } = props
    return <TextField
        {...config}
        disabled={disabled}
        helperText={error && (typeof value === "string" ? stringHelperText : numHelperText)}
        error={error}
        sx={{ color: 'black', ...sx }}
        variant="outlined"
        size="small"
        label={label}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={e => onChange(e.target.value)}
    />
}