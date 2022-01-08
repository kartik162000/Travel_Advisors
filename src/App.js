import React,{useState,useEffect} from 'react';
import {CssBaseline,Grid} from '@material-ui/core';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import {getPlacesData,getWeatherData} from './api/index'
const App =()=>{
   const [places,setPlaces]=useState([]);
   const [coords, setCoords] = useState({});
   const [bounds, setBounds] = useState(null);
   const [weatherData, setWeatherData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [childClicked, setChildClicked] = useState(null);
   const [autocomplete, setAutocomplete] = useState(null);
   const [filteredPlaces, setFilteredPlaces] = useState([]);
   const [type, setType] = useState('restaurants');
   const [rating, setRating] = useState('');
   useEffect(() => {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        console.log("enc");
         setCoords({ lat: latitude, lng: longitude });
         console.log({ lat: latitude, lng: longitude});
      });
    }, []);

    useEffect(() => {
      const filtered = places.filter((place) => Number(place.rating) > rating);
      setFilteredPlaces(filtered);
    }, [rating]);
    
  
   useEffect(() => {
      if (bounds) {
         setIsLoading(true);
         getWeatherData(coords.lat, coords.lng)
         .then((data) => setWeatherData(data));

        getPlacesData(type,bounds.sw, bounds.ne)
           .then((data) => {
             setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
             setFilteredPlaces([]);
             setRating('');
             setIsLoading(false);
           });
       }
   },[bounds, type])

   const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoords({ lat, lng });
  };


   return( 
      <>
         <CssBaseline/>
         <Header  onPlaceChanged={onPlaceChanged} onLoad={onLoad}/>
         <Grid Grid container spacing ={3} style={{ width:'100%'}}>
            <Grid items xs={12} md={4} >
               <List
                  childClicked={childClicked}
                  isLoading={isLoading}
                  places={filteredPlaces.length ? filteredPlaces : places}
                  type={type}
                  setType={setType}
                  rating={rating}
                  setRating={setRating}
               />
            </Grid>
            <Grid items xs={12} md={8} >
               <Map
                     setBounds={setBounds}
                     setCoords={setCoords}
                     coords={coords}
                      places={filteredPlaces.length ? filteredPlaces : places}
                     setChildClicked={setChildClicked}
                     weatherData={weatherData}
               />
            </Grid>
            </Grid>
    </>
   );
}

export default App;
