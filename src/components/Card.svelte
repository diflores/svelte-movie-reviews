<script>
  import Card, { Content, Media, MediaContent } from "@smui/card";
  import { ImageAspectContainer, Image } from "@smui/image-list";

  export let cardTitle;
  export let cardSubtitle;
  export let cardImage;
  export let onClick;
</script>

<Card style="width: 320px;">
  <Media class="card-media-16x9" aspectRatio="16x9">
    <ImageAspectContainer>
      <Image src={cardImage} alt={cardTitle} />
    </ImageAspectContainer>
    <h2 class="mdc-typography--headline6" style="margin: 0;">
      {cardTitle}
    </h2>
  </Media>
  <Content style="color: #888;">{cardSubtitle}</Content>
</Card>

<style></style>
