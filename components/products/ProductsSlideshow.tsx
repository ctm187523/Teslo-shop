
//para crear el slideShow de las imagenes en pages/product/slug.tsx he instalado --> yarn add react-slideshow-image
//de la url -> https://www.npmjs.com/package/react-slideshow-image
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'; //importamos tambien los estilos del mismo sitio de arriba

import { FC } from 'react';

//importmamos los estilos creados en este directorio
import styles from './ProductSlideshow.module.css';

interface Props {
    images: string[]
}

export const ProductsSlideshow: FC<Props> = ( { images }) => {
   
    return (
        // usamos Slide importado arriba
        <Slide
            easing="ease"
            duration = { 7000 } 
            indicators
        >
          {
              images.map ( image => {
                // las imagenes vienen de public/products
                  const url = `/products/${ image }`
                  return (
                    // en el className usamos los estilos creados en este directorio ProductSlideshow.module.css
                    //lo ponemos entre corchetes [] como una propiedad comnumatada porque el menos de each-slide 
                    //no es un nombre válido para una propiedad de javascript
                      <div className={ styles['each-slide']} key={ image }>
                          <div style={{
                            //la imagen la colocamos de la constante url de arriba
                              backgroundImage: `url(${ url })`,
                              backgroundSize: 'cover'
                          }}>

                          </div>
                      </div>
                  )
              })
          }
        </Slide>
    )
}


