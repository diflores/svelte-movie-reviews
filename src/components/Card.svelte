<script>
  import Card, { Content, Media, MediaContent } from "@smui/card";
  import { ImageAspectContainer, Image } from "@smui/image-list";

  export let cardTitle;
  export let cardSubtitle;
  export let cardImage;
</script>

<Card style="max-width: 350px;">
  <div id="card-image">
    <Image src={cardImage} alt={cardTitle} style="height: 180px; width: 120px; align-self: center"/>
  </div>
  <div style="padding: 1rem;">
    <h2 id="card-title" style="margin: 0;">{cardTitle}</h2>
    <h3 id="card-subtitle" style="margin: 0;">{cardSubtitle}</h3>
  </div>
</Card>

<style>
#card-image {
  display: flex;
  justify-content: center;
}
#card-title {
  color: var(--grey);
  font-weight: 400;
  font-size: 20px;
}
#card-subtitle {
  color: var(--grey);
  font-weight: 300;
  font-size: 14px;
}
</style>
