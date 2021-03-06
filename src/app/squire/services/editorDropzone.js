import _ from 'lodash';

/* @ngInject */
function editorDropzone($rootScope, gettextCatalog, attachmentFileFormat, squireExecAction) {
    const CLASS_DRAGGABLE = 'editorDropzone-enter';
    const dictDefaultMessage = gettextCatalog.getString('Drop an image here to insert', null, 'Info');

    const getConfig = (message, node) => ({
        addRemoveLinks: false,
        dictDefaultMessage,
        url: '/file/post',
        acceptedFiles: 'image/*',
        autoProcessQueue: false,
        previewTemplate: '<div style="display:none"></div>',
        paramName: 'file', // The name that will be used to transfer the file
        init() {
            this.on('addedfile', (file) => {
                squireExecAction.insertImage(message, { url: '', file });
                this.removeAllFiles();
                node[0].classList.remove(CLASS_DRAGGABLE);
            });
        }
    });

    return (node, message, editor) => {
        const $dropzone = node[0].querySelector('.squire-dropzone');
        const dropzone = new Dropzone($dropzone, getConfig(message, node));

        const addClass = (className) => node[0].classList.add(className);
        const removeClass = (className) => node[0].classList.remove(className);

        /**
         * Hide the dropzone after the last dragover event
         * Dragleave event is inconsistant.
         */
        const onDragOver = _.debounce(() => removeClass(CLASS_DRAGGABLE), 500);

        /**
         * Display dropzone to the user
         */
        const onDragEnter = (e) => {
            attachmentFileFormat.isUploadAbleType(e) && addClass(CLASS_DRAGGABLE);
        };

        node[0].addEventListener('dragenter', onDragEnter);
        editor.addEventListener('dragenter', onDragEnter);
        $dropzone.addEventListener('dragover', onDragOver);

        return () => {
            node[0].removeEventListener('dragenter', onDragEnter);
            editor.removeEventListener('dragenter', onDragEnter);
            $dropzone.removeEventListener('dragover', onDragOver);
            dropzone.off('addedfile');
            dropzone.destroy();
        };
    };
}
export default editorDropzone;
