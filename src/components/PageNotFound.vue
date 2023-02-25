<template>
  <div class="error">
    <p class="oops">Oops!</p>
    <p class="not-found">Page not found.</p>
    <img src="../assets/not-found.png" alt="page-not-found">

    <p class="return">Would you like to return to the <button 
      class="return-btn"
      @click="$router.push('/')"
    >MAIN PAGE</button> ?</p>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound'
}
</script>

<style lang="css" scoped>
.error {
  text-align: center;
}
.oops {
  font-size: 60px;
  font-weight: 700;
  font-family: cursive;
  margin: 20px;
}

.not-found {
  font-size: 30px;
  font-family: monospace;
  margin: 40px;
}

.return {
  font-size: 24px;
  font-family: monospace;
  margin: 10px;
}

.return-btn {
  font-family: monospace;
  font-size: 24px;
  font-weight: 700;
  color: rgba(0, 88, 202, 0.76);
  border: none;
  background-color: transparent;
  text-decoration: underline;
  cursor: pointer;
}

.return-btn:hover {
  color: rgb(1, 73, 168);
}
</style>