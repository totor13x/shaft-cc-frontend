<template>
  <div class="columns">
    <div class="column">
      <b-field>
        <b-upload v-model="dropFiles" multiple drag-drop expanded>
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large" />
              </p>
              <p>Дропни сюда скрины или видео</p>
            </div>
          </section>
        </b-upload>
      </b-field>
      <!-- <b-field> -->
      <div v-for="(file, index) in dropFiles" :key="index" class="field is-relative">
        <b-progress :value="(indexUpload == index ? progressUpload : file.errorUpload ? 100 : 0)" size="is-medium" show-value :type="file.errorUpload?'is-danger':null">
          <span v-if="file.errorUpload">
            {{ file.name }}
          </span>
          <span v-else class="has-text-primary">
            {{ file.name }}
          </span>
        </b-progress>

        <span v-if="file.errorUpload" style="position:absolute; bottom: -23px;">
          <b-tooltip :label="file.errorUpload" multilined dashed type="is-danger">
            произошла ошибка при загрузке
          </b-tooltip>
        </span>
        <!-- <span class="tag is-primary is-flex is-relative">
            {{ file.name }}
            <button class="delete is-small absolute-right" type="button" @click="deleteDropFile(index)" />
          </span> -->
      </div>
      <!-- </b-field> -->
    </div>
    <div class="column overflow">
      <b-field v-for="(file, index) in uploadedFiles" :key="index" grouped>
        <p class="control" style="flex: 1">
          <b-button expanded type="is-primary" @click="openProof(file)">
            {{ file.name }} by {{ file.user.username }}
          </b-button>
        </p>
        <p class="control">
          <b-button
            type="is-primary"
            icon-right="pencil"
            @click="editProof(file)"
          />
        </p>
        <p class="control">
          <b-button
            type="is-danger"
            icon-right="close"
          />
        </p>
      </b-field>
    </div>
    <b-modal
      :active.sync="edit.open"
    >
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body">
          <modal-proof-edit :file="edit.file" />
        </section>
      </div>
    </b-modal>
  </div>
</template>

<script>
import modalProofEdit from '~/components/admin/locks/proofs-edit'

export default {
  components: {
    modalProofEdit
  },
  props: {
    lockId: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    file: {},
    edit: {
      open: false,
      file: []
    },
    dropFiles: [],
    canUpload: true,
    indexUpload: 0,
    progressUpload: 0,
    uploadedFiles: []
  }),
  watch: {
    dropFiles () {
      if (this.canUpload) {
        this.uploadDropFile()
      }
    }
  },
  mounted () {
    this.$axios.get(`/api/admin/locks/${this.lockId}/proofs`, {
      params: {
        page: this.page
      }
    })
      .then((res) => {
        console.log('SUCCESS!!')
        this.uploadedFiles = res.data
      })
  },
  methods: {
    openProof (file) {
      const openLink = window.open('', '_blank')
      openLink.location = file.url
    },
    editProof (file) {
      this.edit.open = true
      this.edit.file = file
    },
    deleteProof (file) {
      alert('aaa')
    },
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
    },
    uploadDropFile () {
      if (this.dropFiles.length === 0) return
      if (this.dropFiles.length - 1 < this.indexUpload) return
      if (!this.canUpload) return

      console.log('upload file')
      this.canUpload = false
      // setTimeout(() => {
      this.progressUpload = 0
      const drop = this.dropFiles[this.indexUpload]
      // this.$set(this.dropFiles[this.indexUpload], 'uploadPercentage', 0)
      console.log('uploaded file ' + drop.name)
      const formData = new FormData()
      formData.append('file', drop)
      setTimeout(() => {
        this.$axios.post(`/api/admin/locks/${this.lockId}/proofs`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent
            this.progressUpload = parseInt(Math.round((loaded / total) * 100))
            // this.dropFiles[this.indexUpload].uploadPercentage = parseInt(Math.round((loaded / total) * 100))
          }
        })
          .then((res) => {
            this.uploadedFiles = res.data
            this.dropFiles.splice(this.indexUpload, 1)
          })
          // eslint-disable-next-line handle-callback-err
          .catch((error) => {
            this.$set(this.dropFiles[this.indexUpload], 'errorUpload', error.response.data.errors.file[0])
            this.indexUpload = this.indexUpload + 1
          })
          .finally(() => {
            this.canUpload = true
            this.progressUpload = 0
            setTimeout(() => {
              this.uploadDropFile()
            }, 500)
          })
      }, 1000)
      // this.canUpload = true
      // this.uploadDropFile()
      // }, 500)
    }
  }
}
</script>
<style scoped lang="scss">
  .overflow {
    overflow: auto;
    height: 400px;
  }
</style>
