import React from 'react'
import './styles.css'

import { arc } from "d3-shape"
import { scaleLinear } from "d3-scale"
import { format } from "d3-format"


const Gauge = ({value, min, max, label, units, cor1, cor2}) => {
    

    if (value==='initial'){value=null}
    if (max==='initial'){max=null}
    if (min==='initial'){min=null}

    if(value===null||max===null||min===null)return(<h2>Por favor, cadastrar as metas</h2>)
    
    console.log(value)
    console.log(min)
    console.log(max)
    const backgroundArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1)
    () 

    const percentScale = scaleLinear()
        .domain([min, max])
        .range([0,1])
    const percent = percentScale(value)

    const angleScale = scaleLinear()
        .domain([0,1])
        .range([-Math.PI/2, Math.PI/2])
        .clamp(true)
    const angle=angleScale(percent)

    const filledArc = arc()
        .innerRadius(0.65)
        .outerRadius(1)
        .startAngle(-Math.PI / 2)
        .endAngle(angle)
        .cornerRadius(1)
        ()

    const colorScale = scaleLinear()
        .domain([0, 1])
        .range([cor1, cor2])
    
    const gradientSteps = colorScale.ticks(10)
        .map(value => colorScale(value))
    
    
    return(
        <div className='gaugeDiv'>
            {(value!==null&&max!==null&&min!==null) ? (
            <React.Fragment>
            <svg style={{overflow:'visible'}} 
            width='100%'
            viewBox={[
                -1, -1,
                2, 1,
            ].join(" ")}>
                 <defs>
                    <linearGradient
                        id="Gauge__gradient"
                        gradientUnits="userSpaceOnUse"
                        x1="-1"
                        x2="1"
                        y2="0">
                        {gradientSteps.map((color, index) => (
                        <stop
                        key={color}
                        stopColor={color}
                        offset={`${
                        index
                        / (gradientSteps.length - 1)
                        }`}
                        />
                        ))}        
                    </linearGradient>
                </defs>
                <path
                    d={backgroundArc}
                    fill="#0B0A08"
                />
                <path
                    d={filledArc}
                    fill="url(#Gauge__gradient)"
                />
                <path
                    d="M0.136364 0.0290102C0.158279 -0.0096701 0.219156 -0.00967009 0.241071 0.0290102C0.297078 0.120023 0.375 0.263367 0.375 0.324801C0.375 0.422639 0.292208 0.5 0.1875 0.5C0.0852272 0.5 -1.8346e-08 0.422639 -9.79274e-09 0.324801C0.00243506 0.263367 0.0803571 0.120023 0.136364 0.0290102ZM0.1875 0.381684C0.221591 0.381684 0.248377 0.356655 0.248377 0.324801C0.248377 0.292947 0.221591 0.267918 0.1875 0.267918C0.153409 0.267918 0.126623 0.292947 0.126623 0.324801C0.126623 0.356655 0.155844 0.381684 0.1875 0.381684Z"
                    transform={`rotate(${
                        angle * (180 / Math.PI)
                    }) translate(-0.2, -0.33)`}
                    fill="#0B0A08"
                />
                
                <text
                    textAnchor="middle" x="-1.1" y="0" fontSize='0.15'> 
                    {min}
                </text>
                <text
                    textAnchor="middle" x="1.1" y="0" fontSize='0.15'>
                    {max}
                </text>
            </svg>
            <div style={{
                marginTop: "1em",
                fontSize: "2.5em",
                lineHeight: "1em",
                fontWeight: "900",
                fontFeatureSettings: "'zero', 'tnum' 1",
            }}>
                { format(",")(value) }
            </div>
            {!!label && (
                <div style={{
                color: "#444444",
                marginTop: "0.2em",
                fontSize: "1em",
                lineHeight: "1em",
                fontWeight: "700",
                }}>
                { label }
                </div>
            )}
            {!!units && (
                <div style={{
                color: "#444444",
                lineHeight: "1em",
                fontWeight: "300",
                }}>
                { units }
            </div>
            )}
            </React.Fragment> ) : (<h2>Por favor, cadastrar as metas</h2>)}
        </div>
    )

} 

export default Gauge;