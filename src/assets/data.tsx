/* type holeType = [number,number,number];
type hole = {
    lat : number,
    lng : number,
    danger : number,
    key : string
}
 */
export const holes = [
    {lat:-34.397,lng:150.0,danger:0.0},
    {lat:-34.397,lng:150.7,danger:0},
    {lat:-34.397,lng:151.644,danger:0},
    {lat:-34.397,lng:152.644,danger:0},
]
   
   
export {};

/* const formatted : hole[] = holes.map(([lat,lng,danger])=>({
  
    lat,
    lng,
    danger,
    key : JSON.stringify({lat,lng,danger})
}))
export default formatted */