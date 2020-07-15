import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    width: 300
  }
});

const muiTheme = createMuiTheme({
    overrides:{
      MuiSlider: {
        thumb:{
        color: '#4E9C81',
        },
        track: {
          color: '#525252'
        },
        rail: {
          color: 'gray'
        }
      }
  }
  });

function valuetext(value) {
  return `${value}°C`;
}

export default function RangeSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState([2010, 2019]);

  const handleChange = (event, newValue) => {
    if (newValue[1] !== newValue[0]) {
      setValue(newValue);
      props.updateRange(newValue);
      console.log(props)
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="range-slider" gutterBottom style={{margin: 35}}>
        Percent Change: <strong>{value[0]}</strong> &#8594; <strong>{value[1]}</strong>
      </Typography>
      <ThemeProvider theme={muiTheme}>
        <Slider
            marks={true}
            min={2010}
            max={2019}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            getAriaValueText={valuetext}
        />
      </ThemeProvider>
      
    </div>
  );
}
