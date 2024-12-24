<svg
  id="Layer_1"
  data-name="Layer 1"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512 512"
  {...restProps}
>
  <path
    class="cls-1"
    d="M89.83,145.94l-9.94-7.43L11.36,253.09,79.89,368.6l9.94-8.37c-21.28-29.17-34.06-66.48-34.06-107.14S68.55,175.11,89.83,145.94Z"
  />
  <circle class="cls-2" cx="256" cy="256" r="117.48" />
  <circle class="cls-3" cx="256" cy="256" r="174.64" />
  <path class="cls-1" d="M222,308.36V198.75h25.31v87.38h53.11v22.23Z" />
</svg>

<script lang="ts">
  const { ...restProps } = $props();
</script>

<style>
  .cls-1 {
    fill: currentcolor;
  }
  .cls-2,
  .cls-3 {
    fill: none;
    stroke: currentcolor;
    stroke-miterlimit: 10;
  }
  .cls-2 {
    stroke-width: 15px;
  }
  .cls-3 {
    stroke-width: 20px;
  }
</style>
