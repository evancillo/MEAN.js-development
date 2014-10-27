/**
 * Created by sergio on 26-10-14.
 */
'use strict';

angular.module('folders').factory('RootFolder',['$resource', 'Authentication', 'Folders','RootFolderObj',
    function($resource, Authentication, Folders, RootFolderObj) {

        var authentication = Authentication;
        var rootFolder = ""

        var folderRoot = $resource('/folder/user/:userId/folderName/:name', {
            'userId' : authentication.user._id,
            name: 'root'
        });


        return {
            getRootFolder : function(){

                    return folderRoot.get(function(resp){
                            if (resp.status == 0){
                                var folder = new Folders({
                                    name: 'root'
                                });

                                folder.$save(function(respu){
                                    console.log("se crea folder root", respu);
                                    RootFolderObj.setFolder(respu);

                                }, function(error){
                                    console.error("error al crear root", error);
                                })
                            }
                            if (resp.status == 1){
                                rootFolder = resp.data[0];
                                RootFolderObj.setFolder(rootFolder);

                            }
                        });
           }

        }

    }
]);

angular.module('folders').factory('RootFolderObj', [function(){

    var folder = "";

    return {
        setFolder : function(obj){
            folder = obj;
        },
        getFolder : function(){
            return folder;
        }
    }

}]);