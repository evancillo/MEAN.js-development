'use strict';

(function() {
	// Folders Controller Spec
	describe('Folders Controller Tests', function() {
		// Initialize global variables
		var FoldersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Folders controller.
			FoldersController = $controller('FoldersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Folder object fetched from XHR', inject(function(Folders) {
			// Create sample Folder using the Folders service
			var sampleFolder = new Folders({
				name: 'New Folder'
			});

			// Create a sample Folders array that includes the new Folder
			var sampleFolders = [sampleFolder];

			// Set GET response
			$httpBackend.expectGET('folders').respond(sampleFolders);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.folders).toEqualData(sampleFolders);
		}));

		it('$scope.findOne() should create an array with one Folder object fetched from XHR using a folderId URL parameter', inject(function(Folders) {
			// Define a sample Folder object
			var sampleFolder = new Folders({
				name: 'New Folder'
			});

			// Set the URL parameter
			$stateParams.folderId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/folders\/([0-9a-fA-F]{24})$/).respond(sampleFolder);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.folder).toEqualData(sampleFolder);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Folders) {
			// Create a sample Folder object
			var sampleFolderPostData = new Folders({
				name: 'New Folder'
			});

			// Create a sample Folder response
			var sampleFolderResponse = new Folders({
				_id: '525cf20451979dea2c000001',
				name: 'New Folder'
			});

			// Fixture mock form input values
			scope.name = 'New Folder';

			// Set POST response
			$httpBackend.expectPOST('folders', sampleFolderPostData).respond(sampleFolderResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Folder was created
			expect($location.path()).toBe('/folders/' + sampleFolderResponse._id);
		}));

		it('$scope.update() should update a valid Folder', inject(function(Folders) {
			// Define a sample Folder put data
			var sampleFolderPutData = new Folders({
				_id: '525cf20451979dea2c000001',
				name: 'New Folder'
			});

			// Mock Folder in scope
			scope.folder = sampleFolderPutData;

			// Set PUT response
			$httpBackend.expectPUT(/folders\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/folders/' + sampleFolderPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid folderId and remove the Folder from the scope', inject(function(Folders) {
			// Create new Folder object
			var sampleFolder = new Folders({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Folders array and include the Folder
			scope.folders = [sampleFolder];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/folders\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFolder);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.folders.length).toBe(0);
		}));
	});
}());