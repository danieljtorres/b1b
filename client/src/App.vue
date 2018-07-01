<template>
  <div :class="{'nav-open': $sidebar.showSidebar}">
    <notifications>
      <template slot="body" slot-scope="props">
        <div class="custom-template">
          <div class="custom-template-icon">
            <i class="icon ion-android-checkmark-circle"></i>
          </div>
          <div class="custom-template-content">
            <div class="custom-template-title">
              {{props.item.title}}
            </div>
          </div>
          <div class="custom-template-close" @click="props.close">
            <i class="icon ion-android-close"></i>
          </div>
        </div>
      </template>
    </notifications>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.vue-notifyjs.notifications {
  .alert {
    z-index: 10000;
  }
  .list-move {
    transition: transform 0.3s, opacity 0.4s;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active {
    transition: transform 0.2s ease-in, opacity 0.4s ease-in;
  }
  .list-leave-active {
    transition: transform 1s ease-out, opacity 0.4s ease-out;
  }

  .list-enter {
    opacity: 0;
    transform: scale(1.1);
  }
  .list-leave-to {
    opacity: 0;
    transform: scale(1.2, 0.7);
  }
}

.md-tab {
    padding: 4px 1px !important;
}

.md-scrollbar.md-theme-default::-webkit-scrollbar-thumb {
    background: #448aff !important;
    background: #448aff !important;
}

.md-scrollbar::-webkit-scrollbar-thumb {
    border-radius: 0px !important;
}

.md-card {
  border-radius: 0px !important;
}
</style>
