<template>
  <div class="container">
    <header class="header">
      <div class="left-section">
        <img src="../assets/img/logo.svg" alt="Логотип" class="logo" />
        <span class="logo-text">Онлайн-тренировки для дома</span>
      </div>
      <button class="custom-btn">Войти</button>
    </header>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.header {
  max-width: 1160px;
  margin: 0 auto;
  padding-bottom: 20px;
  padding-right: 20px;
  padding-left: 20px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;

  .left-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;

    .logo {
      display: block;
      max-height: 40px;
    }

    .logo-text {
      font-size: 16px;
      line-height: 1.2;
    }
  }

  .custom-btn {
    width: 103px;
    height: 45px;
    background: #bcec30;
    border-radius: 26px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;

    &:hover {
      background: #a8d52b;
    }
  }
}
</style>
