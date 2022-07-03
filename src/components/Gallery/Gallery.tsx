import { Row, Col, Image } from 'react-bootstrap';
import { FunctionComponent } from 'react';
import classes from './Gallery.module.css';

type GalleryProps = {
  type?: string;
  items: any[];
  limit?: number;
};

const Gallery: FunctionComponent<GalleryProps> = (props: GalleryProps) => {

  // Dynamic Classes
  const dynamicClasses = {
    image: [classes.image, props.type === "artist" ? "rounded-circle" : ""].join(' ')
  }

  // Event Handlers
  function imageClickHandler(href: Location) {
    window.location = href
  }

  // Generate Gallery Items
  const items = props.items.map(item => {
    const imageUrl = item.type === 'track' ? item?.album?.images[0]?.url : item?.images[0]?.url;

    let subtitle = null;
    if (item.type === 'artist') {
      subtitle = <div className={classes.subtitle}>{item?.followers?.total.toLocaleString()} Followers</div>;
    } else if (item.type === 'track') {
      subtitle = <div className={classes.subtitle}>{item?.album?.name}</div>
    }

    return (
      <Col key={item.id} className={classes.column}>
        <div>
          <Image id="image" className={dynamicClasses.image} alt={item?.name}
            src={imageUrl} onClick={() => imageClickHandler(item?.external_urls.spotify)} />
        </div>
        <a className={classes.title} href={item?.external_urls.spotify}>{item?.name}</a>
        {subtitle}
      </Col>
    )
  });

  return (
    <Row className="d-flex flex-wrap">
      {items.slice(0, props.limit || items.length)}
    </Row>
  );
}

export default Gallery;
