<script>
  import BorderButton from "./components/BorderButton.svelte";
  import BorderIcon from "./components/BorderIcon.svelte"; 
  import { borders } from "./stores";


  

  function msg({detail}) {
    if (detail) {
      parent.postMessage(
        { pluginMessage: { type: detail.action, position: detail.position, weight:detail.weight } },
        '*'
      )      
    }

  }
</script>

<style>
  .main {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .tips {
    font-size: 1em;
    color: #333;
    background: #eee;
    border-radius: 5px;
    text-align: center;
    padding: 8px;
  }
  ul li {
    display: inline-block;
    margin-bottom: 5px;
    /* font-size: 1.5em; */
  }
</style>

<div class="main inner">
  {#if $borders.length > 0}
  <ul>
     {#each $borders as border }
      <noscript>       
        {#if border.weight == undefined}       
         {border.weight = 0 }
         {/if}
      </noscript>
      <li>  
        <BorderButton on:msg={msg} {...border} >
            <BorderIcon position={border.position}/>
        </BorderButton>
      </li>
    {/each}
    
  </ul>
  {:else}
  <div class="tips">Select one or more Frame layers.</div>
  {/if}
</div>


