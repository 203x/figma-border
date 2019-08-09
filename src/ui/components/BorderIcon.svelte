<script>
export let position;

</script>

<div class="{position} no-select"></div>

<style>
div {
  width: 1em;
  height: 1em;
  box-sizing: border-box;
  display: inline-block;
  border: 2px solid rgba(0, 0, 0, 0.15);
  position: relative;
  vertical-align: -.15em;
}
div::before {
  content: '';
  display: block;
  /* width: 100%; */
  /* height: 100%; */
  position: absolute;
  left: -2px;
  top: -2px;
  right: -2px;
  bottom: -2px;
}
div.top::before {
  border-top: 2px solid #000;
}
div.bottom::before {
  border-bottom: 2px solid #000;
}
div.left::before {
  border-left: 2px solid #000;
}
div.right::before {
  border-right: 2px solid #000;
}
:global(.active) div {
  border: 2px solid rgba(255, 255, 255, 0.15);
}
:global(.active) div.top::before,
:global(.active) div.bottom::before,
:global(.active) div.right::before,
:global(.active) div.left::before {
  border-color: #fff;
}
</style>
