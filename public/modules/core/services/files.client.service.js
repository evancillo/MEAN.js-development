/**
 * Created by sergio on 21-11-14.
 */

angular.module('core').factory('FileProperty', [function(){

    return {
        getIconClass : function(type){
            switch (type){
                case 'folder':
                    return "dms-icon-folder type-folder"
                    break;
                case 'image/png':
                    return "dms-icon-file-photo-o type-img"
                    break;
                case 'image/jpeg':
                    return "dms-icon-file-photo-o type-img"
                    break;
                case 'application/msword':
                    return "dms-icon-file-word-o type-word"
                    break;
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    return "dms-icon-file-word-o type-word"
                    break;
                case 'application/pdf':
                    return "dms-icon-file-pdf-o type-pdf"
                    break;
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    return "dms-icon-file-excel-o type-excel"
                    break;
                case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                    return "dms-icon-file-powerpoint-o type-ppt"
                    break;
                case "audio/mpeg":
                    return "dms-icon-file-sound-o type-mp3"
                    break;
                case "video/mp4":
                    return "dms-icon-file-movie-o type-mp4"
                    break;
                case "text/javascript":
                    return "dms-icon-file-css type-file"
                    break;
                case "text/html":
                    return "dms-icon-file-code-o type-file"
                default :
                    return "dms-icon-file-o type-file"
                    break;

            }
        }
    }
}]);