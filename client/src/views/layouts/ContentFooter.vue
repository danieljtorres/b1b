<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul>
          <li>
            <router-link :to="{path:'/dashboard'}">2018</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright d-flex flex-wrap">

                              
<div class="modal fade" id="modalContactForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <!--Modal: Contact form-->
    <div class="modal-dialog cascading-modal" role="document">

        <!--Content-->
        <div class="modal-content">

            <!--Header-->
            <div class="modal-header primary-color white-text">
                <h4 class="title">
                    <i class="fa fa-pencil"></i> Contact form</h4>
                <button type="button" class="close waves-effect waves-light" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <!--Body-->
            <div class="modal-body">

                <!-- Material input name -->
                <div class="md-form form-sm">
                    <i class="fa fa-envelope prefix"></i>
                    <input type="text" id="materialFormNameModalEx1" class="form-control form-control-sm">
                    <label for="materialFormNameModalEx1">Your name</label>
                </div>

                <!-- Material input email -->
                <div class="md-form form-sm">
                    <i class="fa fa-lock prefix"></i>
                    <input type="password" id="materialFormEmailModalEx1" class="form-control form-control-sm">
                    <label for="materialFormEmailModalEx1">Your email</label>
                </div>

                <!-- Material input subject -->
                <div class="md-form form-sm">
                    <i class="fa fa-tag prefix"></i>
                    <input type="text" id="materialFormSubjectModalEx1" class="form-control form-control-sm">
                    <label for="materialFormSubjectModalEx1">Subject</label>
                </div>

                <!-- Material textarea message -->
                <div class="md-form form-sm">
                    <i class="fa fa-pencil prefix"></i>
                    <textarea type="text" id="materialFormMessageModalEx1" class="md-textarea form-control"></textarea>
                    <label for="materialFormMessageModalEx1">Your message</label>
                </div>

                <div class="text-center mt-4 mb-2">
                    <button class="btn btn-primary">Send
                        <i class="fa fa-send ml-2"></i>
                    </button>
                </div>

            </div>
        </div>
        <!--/.Content-->
    </div>
    <!--/Modal: Contact form-->
</div>
                      
        &copy; Creado por
        <i class="fa fa-heart heart"></i>
        <a href="#" target="_blank"> &nbsp; B1b.</a>&nbsp;
        Designed by <a href="https://www.creative-tim.com/?ref=pdf-vuejs" target="_blank">&nbsp;Texto</a>
      </div>
    </div>
  </footer>
</template>
<script>
export default {};
</script>
<style>
</style>
