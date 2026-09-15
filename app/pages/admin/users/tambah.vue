<script setup lang="ts">
    definePageMeta({layout:'admin'})

</script>


<template>
    <h1>Tambah User</h1>
    <form style="display: flex; flex-direction: column; gap: 2px;">
        <label for="">Nama Pengguna</label>
        <input>
        <label for="">User Name</label>
        <input>
        <label for="">Password</label>
        <input>
        <button class="btn">Simpan</button>
    </form>
</template>


<style>
label{
    margin-top: 10px;
}

button{
    margin-top: 30px;
    height: 45px;
}
</style>